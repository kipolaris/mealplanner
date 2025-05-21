import { useEffect, useState} from "react";
import { BackendUrl} from "../utils/constants";

export const useUnitOfMeasure = () => {
    const [unitsOfMeasure, setUnitsOfMeasure] = useState([])

    useEffect(() => {
        fetch(`${BackendUrl}/api/units`)
            .then(response => response.json())
            .then(data => {
                console.log('Received units of measure:', data);
                setUnitsOfMeasure(data);
            })
            .catch(error => console.error('Failed to fetch units of measure:', error))
    }, []);

    return unitsOfMeasure
}