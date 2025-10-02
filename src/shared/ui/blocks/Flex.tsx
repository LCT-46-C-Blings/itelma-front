
/**
 * A component that renders a flex box with a border.
 *
 * It accepts a className prop which is used to add additional CSS classes to the component.
 *
 * It renders its children inside a div element with a flex CSS class.
 */
const Flex: React.FC<{
    className?: string,
    children?: React.ReactNode
}> = (props) => {
    return (
        <div className={"flex box-border " + props.className}>
            {props.children}
        </div>
    )
}

export default Flex