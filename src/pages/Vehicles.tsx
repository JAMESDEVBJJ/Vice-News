import { useMemo, useState } from "react";
import { Info, SearchX } from "lucide-react";
import CategoryNav from "../components/vehicles/CategoryNav";
import VehicleFilters from "../components/vehicles/VehicleFilters";
import VehicleCard from "../components/vehicles/VehicleCard";
import {
  vehicleCategories,
  vehicles,
  type VehicleCategoryId,
  type VehicleTag,
} from "../data/vehiclesMock";
import styles from "./Vehicles.module.css";
import Logo from "../components/brand/Logo";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const categoryCounts = Object.fromEntries(
  vehicleCategories.map((category) => [
    category.id,
    vehicles.filter((vehicle) => vehicle.category === category.id).length,
  ])
) as Record<VehicleCategoryId, number>;

export default function Vehicles() {
  const [category, setCategory] = useState<VehicleCategoryId | null>(null);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<VehicleTag[]>([]);

  // Filtro simples só para os estados da interface ficarem visíveis.
  // Se preferir só o visual nesta etapa, use `vehicles` direto no grid.
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return vehicles.filter(
      (vehicle) =>
        (!category || vehicle.category === category) &&
        activeTags.every((tag) => vehicle.tags.includes(tag)) &&
        (!term ||
          `${vehicle.brand ?? ""} ${vehicle.name}`.toLowerCase().includes(term))
    );
  }, [category, query, activeTags]);

  const hasFilters = category !== null || query !== "" || activeTags.length > 0;

  const toggleTag = (tag: VehicleTag) =>
    setActiveTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag]
    );

  const clearFilters = () => {
    setCategory(null);
    setQuery("");
    setActiveTags([]);
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
        <CategoryNav
          active={category}
          counts={categoryCounts}
          onChange={setCategory}
        />

        <div className={styles.toolbar}>
          <VehicleFilters
            query={query}
            onQueryChange={setQuery}
            activeTags={activeTags}
            onToggleTag={toggleTag}
          />
        </div>

        <section aria-labelledby="vehicles-heading">
          <h2 id="vehicles-heading" className={styles.srOnly}>
            Lista de veículos
          </h2>

          <div className={styles.results}>
            <p className={styles.resultsCount} aria-live="polite">
              <strong>{filtered.length}</strong> de {vehicles.length} veículos
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
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
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
        </section>
      </main>
      <Footer></Footer>
    </div>
  );
}
