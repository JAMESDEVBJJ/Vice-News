import { useState, useCallback } from "react";
import VehicleRegistration from "./VehicleRegistration";
import pageStyles from "./Vehicles.module.css";
import headerStyles from "../NewsEditor.module.css";
import Footer from "../../../components/layout/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CarFront, Loader2 } from "lucide-react";
import { getVehicleById, type VehicleResponse } from "../../../api/vehiclesApi";
import { toast } from "../../../lib/toast";
import { useApiResource } from "../../../hooks/useApiResource";

interface VehiclesAdminProps {
  vehicleToEdit?: VehicleResponse;
}

export default function VehiclesAdmin({ vehicleToEdit }: VehiclesAdminProps) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { id } = useParams();
  const vehicleId = id ? Number(id) : null;

  const isEditing = Boolean(vehicleId);
  function handleCreated(vehicle: VehicleResponse) {
    toast.success(
      isEditing ? "Veículo atualizado" : "Veículo cadastrado",
      isEditing
        ? `${vehicle.name} foi atualizado.`
        : `${vehicle.name} já está disponível na base de veículos.`
    );
    navigate("/vehicles");
  }

  const loadVehicle = useCallback(
    (signal: AbortSignal) => getVehicleById(vehicleId as number, signal),
    [vehicleId]
  );

  const { status, data, error, retry } = useApiResource(loadVehicle);

  return (
    <div className={pageStyles.page}>
      <header className={headerStyles.topbar}>
        <div className={headerStyles.topbarInner}>
          <Link to="/" className={headerStyles.back}>
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar
          </Link>

          <div className={headerStyles.topbarTitle}>
            <span className={headerStyles.eyebrow}>ADMIN</span>
            <h1 className={headerStyles.pageTitle}>
              {isEditing ? "Editar veículo" : "Novo veículo"}
            </h1>
          </div>

          <div className={headerStyles.actions}>
            <button
              type="submit"
              form="vehicle-registration-form"
              className={headerStyles.btnPrimary}
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? (
                <Loader2
                  size={16}
                  className={pageStyles.spinner}
                  aria-hidden="true"
                />
              ) : (
                <CarFront size={16} aria-hidden="true" />
              )}
              {submitting
                ? isEditing
                  ? "Salvando…"
                  : "Cadastrando…"
                : isEditing
                ? "Salvar alterações"
                : "Cadastrar veículo"}
            </button>
          </div>
        </div>
      </header>

      <main className={pageStyles.main}>
        {vehicleId ? (
          data ? (
            <VehicleRegistration
              key={vehicleId}
              vehicleToEdit={data}
              onCreated={handleCreated}
              onSubmittingChange={setSubmitting}
            />
          ) : (
            <p>Carregando veículo...</p>
          )
        ) : (
          <VehicleRegistration
            onCreated={handleCreated}
            onSubmittingChange={setSubmitting}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
