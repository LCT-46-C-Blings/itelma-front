import CTGChart from "../../Charts/ui"

/**
 * A React component that renders a CTGChart with a type of "bpm".
 * Accepts a className prop to allow for custom styling.
 */
const BpmChart: React.FC<{
    className?: string
}> = (props) => {
    return (
        <CTGChart className={props.className} type="bpm" />
    )
}

export default BpmChart
