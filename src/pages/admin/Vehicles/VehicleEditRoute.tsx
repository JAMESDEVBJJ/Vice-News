import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import VehiclesAdmin from "./VehiclesAdmin";
import pageStyles from "./Vehicles.module.css";
import { getVehicleById } from "../../../api/vehiclesApi";
import { getErrorMessage } from "../../../api/httpClient";
import { useApiResource } from "../../../hooks/useApiResource";

export default function VehicleEditRoute() {
  const { id } = useParams();
  const vehicleId = Number(id);

  // nova função (nova identidade) sempre que o id muda
  const loadVehicle = useCallback(
    (signal: AbortSignal) => getVehicleById(vehicleId, signal),
    [vehicleId]
  );

  const { status, data, error, retry } = useApiResource(loadVehicle);

  if (status === "success" && data) {
    // key remonta o form se o id mudar, então o estado inicial é recalculado
    return <VehiclesAdmin key={data.id} vehicleToEdit={data} />;
  }

  return (
    <div className={pageStyles.page}>
      <main className={pageStyles.main}>
        {status === "error" ? (
          <>
            <p role="alert">{getErrorMessage(error)}</p>
            <button type="button" onClick={retry}>
              Tentar novamente
            </button>
          </>
        ) : (
          <Loader2
            className={pageStyles.spinner}
            aria-label="Carregando veículo"
          />
        )}
      </main>
    </div>
  );
}
