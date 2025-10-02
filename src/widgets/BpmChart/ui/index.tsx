import CTGChart from "../../Charts/ui"

const BpmChart: React.FC<{
    className?: string
}> = (props) => {
    return (
        <CTGChart className={props.className} type="bpm" />
    )
}

export default BpmChart
