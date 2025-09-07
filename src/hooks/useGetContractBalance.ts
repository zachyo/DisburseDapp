import { useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";


const useGetContractBalance = () => {
    const [balance, setBalance] = useState<number>();
    const publicClient = usePublicClient();   

    useEffect(() => {
        (async () => {
            const result = await publicClient?.getBalance({
                address: import.meta.env
                    .VITE_QUADRATIC_GOVERNACE_CONTRACT            
            });
            setBalance(Number(result));
        })();
    }, [publicClient]);

    // recompute the memoized value when one of the deps has changed.
    return useMemo(() => balance, [balance]);
};

export default useGetContractBalance;