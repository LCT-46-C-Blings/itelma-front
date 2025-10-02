import Flex from "./Flex"

/**
 * A component that renders an info block with a white background and rounded corners.
 *
 * It displays a label and a value inside the block.
 * The component accepts a className prop which is used to add additional CSS classes to the component.
 * The component also accepts labelClassName and valueClassName props which are used to add additional CSS classes to the label and value elements respectively.
 */
const InfoBlock: React.FC<{
    value: string
    label: string
    className?: string
    labelClassName?: string
    valueClassName?: string
}> = ({ value, label, ...props }) => {
    return (
        <Flex className={"flex-col gap-8px p-24px bg-white rounded-10px " + props.className}>
            <p className={"p-0 m-0 font-size-16px text-gray-500 fw-400 " + props.labelClassName}>{label}</p>
            <p className={"p-0 m-0 font-size-24px fw-400 " + props.valueClassName}>{value}</p>
        </Flex>
    )
}

export default InfoBlock;