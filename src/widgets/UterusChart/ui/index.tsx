import CTGChart from "../../Charts/ui"

/**
 * A React component that renders a CTGChart with a type of "uterus".
 * Accepts a className prop to allow for custom styling.
 * 
 * @param {string} [className] Optional CSS class name for the component.
 * 
 * @returns {React.ReactElement} A React element representing the component.
 */
const UterusChart: React.FC<{
    className?: string
}> = (props) => {
    return (
        <CTGChart className={props.className} type="uterus" />
    )
}

export default UterusChart
