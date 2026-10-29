import VehicleRegistration from "./VehicleRegistration";
import pageStyles from "./Vehicles.module.css";
import headerStyles from "../NewsEditor.module.css";
import Footer from "../../../components/layout/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, CarFront } from "lucide-react";

export default function Vehicles() {
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
            >
              <CarFront size={16} aria-hidden="true" />
              Cadastrar veículo
            </button>
          </div>
        </div>
      </header>

      <main className={pageStyles.main}>
        <VehicleRegistration />
      </main>

      <Footer />
    </div>
  );
}
