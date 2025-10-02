import CTGChart from "../../Charts/ui"

const UterusChart: React.FC<{
    className?: string
}> = (props) => {
    return (
        <CTGChart className={props.className} type="uterus" />
    )
}

export default UterusChart
