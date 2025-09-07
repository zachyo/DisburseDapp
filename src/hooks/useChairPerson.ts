import { QUADRATIC_GOVERNACE_CONTRACT_ABI } from "@/config/abi";
import { useEffect, useMemo, useState } from "react";
import { usePublicClient, useReadContract } from "wagmi";


const useChairPerson = () => {
    const [chairPerson, setChairPerson] = useState<address>();
    const publicClient = usePublicClient();

    const res = useReadContract({
        abi: QUADRATIC_GOVERNACE_CONTRACT_ABI,
        address: import.meta.env.VITE_QUADRATIC_GOVERNACE_CONTRACT,
        functionName: "chairperson",
    });

    const resultObject = JSON.parse(JSON.stringify(res));

    console.log("resultObject: ", resultObject.data);

    useEffect(() => {
        (async () => {
            const result = await publicClient?.readContract({
                address: import.meta.env
                    .VITE_QUADRATIC_GOVERNACE_CONTRACT,
                abi: QUADRATIC_GOVERNACE_CONTRACT_ABI,
                functionName: "chairperson",
            });
            setChairPerson(result);
        })();
    }, [publicClient]);

    // recompute the memoized value when one of the deps has changed.
    return useMemo(() => chairPerson, [chairPerson]);
};

export default useChairPerson;