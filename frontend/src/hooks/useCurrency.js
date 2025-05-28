import { BackendUrl} from "../utils/constants";
import { useEffect, useState } from "react";

export const useCurrency = () => {
    const [currencies, setCurrencies] = useState([]);

    useEffect(() => {
        fetch(`${BackendUrl}/api/currencies`)
            .then(response => response.json())
            .then(data => {
                console.log('Received currencies:', data);
                setCurrencies(data);
            })
            .catch(error => console.error('Failed to fetch currencies:', error))
    }, []);

    return currencies
}