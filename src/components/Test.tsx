import { useEffect } from "react"

export const Tests = () => {
    useEffect(() => {
        return () => console.log("test unmounted")
    })
    return <>Hello</>
}