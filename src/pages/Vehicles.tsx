import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CarFront, Info, Loader2, SearchX } from "lucide-react";
import CategoryNav from "../components/vehicles/CategoryNav";
import VehicleFilters from "../components/vehicles/VehicleFilters";
import VehicleCard from "../components/vehicles/VehicleCard";
import { getVehicles, type VehicleResponse } from "../api/vehiclesApi";
import {
  getVehicleCategories,
  type VehicleCategoryResponse,
  type VehicleTagResponse,
} from "../api/vehicleLookupsApi";
import { getErrorMessage } from "../api/httpClient";
import { useApiResource } from "../hooks/useApiResource";
import { isAdmin } from "../lib/auth";
import styles from "./Vehicles.module.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function mergeCategories(
  catalog: VehicleCategoryResponse[],
  vehicles: VehicleResponse[]
): VehicleCategoryResponse[] {
  const byId = new Map(catalog.map((category) => [category.id, category]));

  for (const { category } of vehicles) {
    if (!byId.has(category.id)) byId.set(category.id, category);
  }

  return [...byId.values()];
}

function countByCategory(vehicles: VehicleResponse[]): Record<number, number> {
  const counts: Record<number, number> = {};

  for (const { category } of vehicles) {
    counts[category.id] = (counts[category.id] ?? 0) + 1;
  }

  return counts;
}

function collectTags(vehicles: VehicleResponse[]): VehicleTagResponse[] {
  const bySlug = new Map<string, VehicleTagResponse>();

  for (const vehicle of vehicles) {
    for (const tag of vehicle.tags) bySlug.set(tag.slug, tag);
  }

  return [...bySlug.values()].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR")
  );
}

export default function Vehicles() {
  const vehiclesResource = useApiResource(getVehicles);
  const categoriesResource = useApiResource(getVehicleCategories);

  const [category, setCategory] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const vehicles = useMemo(
    () => vehiclesResource.data ?? [],
    [vehiclesResource.data]
  );
  const categories = useMemo(
    () => mergeCategories(categoriesResource.data ?? [], vehicles),
    [categoriesResource.data, vehicles]
  );
  const categoryCounts = useMemo(() => countByCategory(vehicles), [vehicles]);
  const availableTags = useMemo(() => collectTags(vehicles), [vehicles]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return vehicles.filter(
      (vehicle) =>
        (category === null || vehicle.category.id === category) &&
        activeTags.every((slug) =>
          vehicle.tags.some((tag) => tag.slug === slug)
        ) &&
        (!term ||
          `${vehicle.manufacturer.name} ${vehicle.name}`
            .toLowerCase()
            .includes(term))
    );
  }, [vehicles, category, query, activeTags]);

  const hasFilters = category !== null || query !== "" || activeTags.length > 0;
  const hasVehicles =
    vehiclesResource.status === "success" && vehicles.length > 0;

  const toggleTag = (slug: string) =>
    setActiveTags((current) =>
      current.includes(slug)
        ? current.filter((t) => t !== slug)
        : [...current, slug]
    );

  const clearFilters = () => {
    setCategory(null);
    setQuery("");
    setActiveTags([]);
  };

  const retry = () => {
    vehiclesResource.retry();
    if (categoriesResource.status === "error") categoriesResource.retry();
  };

  return (
    <div className={styles.page}>
      <div aria-hidden className={styles.ambient} />
      <Header></Header>
      <main className={styles.main}>
        <div>
          <h1 className={styles.title}>Base de dados de veículos do GTA VI</h1>
          <p className={styles.intro}>
            Carros, motos, barcos, aeronaves e utilitários de Vice City num só
            lugar. Escolha uma categoria, busque pelo nome ou combine etiquetas
            para comparar os veículos.
          </p>
          <p className={styles.notice}>
            <Info size={15} aria-hidden />
            Desempenho e preços são valores ilustrativos e não representam
            estatísticas oficiais do jogo.
          </p>
        </div>

        {hasVehicles && (
          <>
            <CategoryNav
              categories={categories}
              active={category}
              counts={categoryCounts}
              onChange={setCategory}
            />

            <div className={styles.toolbar}>
              <VehicleFilters
                query={query}
                onQueryChange={setQuery}
                tags={availableTags}
                activeTags={activeTags}
                onToggleTag={toggleTag}
              />
            </div>
          </>
        )}

        <section aria-labelledby="vehicles-heading">
          <h2 id="vehicles-heading" className={styles.srOnly}>
            Lista de veículos
          </h2>

          {vehiclesResource.status === "loading" && (
            <div className={styles.empty} role="status">
              <Loader2 size={30} className={styles.spinner} aria-hidden />
              <p className={styles.emptyTitle}>Carregando veículos</p>
              <p className={styles.emptyText}>
                Buscando a base de dados de Vice City.
              </p>
            </div>
          )}

          {vehiclesResource.status === "error" && (
            <div className={styles.empty} role="alert">
              <AlertTriangle size={30} aria-hidden />
              <p className={styles.emptyTitle}>
                Não foi possível carregar os veículos
              </p>
              <p className={styles.emptyText}>
                {getErrorMessage(vehiclesResource.error)}
              </p>
              <button
                type="button"
                className={styles.emptyAction}
                onClick={retry}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {vehiclesResource.status === "success" && vehicles.length === 0 && (
            <div className={styles.empty}>
              <CarFront size={30} aria-hidden />
              <p className={styles.emptyTitle}>Nenhum veículo cadastrado</p>
              <p className={styles.emptyText}>
                Assim que novos veículos forem cadastrados, eles aparecem aqui.
              </p>
              {isAdmin() && (
                <Link to="/admin/vehicles/new" className={styles.emptyAction}>
                  Cadastrar veículo
                </Link>
              )}
            </div>
          )}

          {hasVehicles && (
            <>
              <div className={styles.results}>
                <p className={styles.resultsCount} aria-live="polite">
                  <strong>{filtered.length}</strong> de {vehicles.length}{" "}
                  veículos
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    className={styles.clear}
                    onClick={clearFilters}
                  >
                    Limpar filtros
                  </button>
                )}
              </div>

              {filtered.length > 0 ? (
                <div className={styles.grid}>
                  {filtered.map((vehicle, index) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.empty}>
                  <SearchX size={30} aria-hidden />
                  <p className={styles.emptyTitle}>Nenhum veículo encontrado</p>
                  <p className={styles.emptyText}>
                    Ajuste a busca ou remova alguns filtros para ver mais
                    resultados.
                  </p>
                  <button
                    type="button"
                    className={styles.emptyAction}
                    onClick={clearFilters}
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer></Footer>
    </div>
  );
}
