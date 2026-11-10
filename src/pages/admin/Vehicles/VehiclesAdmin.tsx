import { useState } from "react";
import VehicleRegistration from "./VehicleRegistration";
import pageStyles from "./Vehicles.module.css";
import headerStyles from "../NewsEditor.module.css";
import Footer from "../../../components/layout/Footer";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CarFront, Loader2 } from "lucide-react";
import type { VehicleResponse } from "../../../api/vehiclesApi";
import { toast } from "../../../lib/toast";

export default function VehiclesAdmin() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  function handleCreated(vehicle: VehicleResponse) {
    toast.success(
      "Veículo cadastrado",
      `${vehicle.name} já está disponível na base de veículos.`
    );
    // A listagem busca os dados ao montar, então já exibe o novo veículo.
    navigate("/vehicles");
  }

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
            <h1 className={headerStyles.pageTitle}>Novo veículo</h1>
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
                <Loader2 size={16} className={pageStyles.spinner} aria-hidden="true" />
              ) : (
                <CarFront size={16} aria-hidden="true" />
              )}
              {submitting ? "Cadastrando…" : "Cadastrar veículo"}
            </button>
          </div>
        </div>
      </header>

      <main className={pageStyles.main}>
        <VehicleRegistration
          onCreated={handleCreated}
          onSubmittingChange={setSubmitting}
        />
      </main>

      <Footer />
    </div>
  );
}
