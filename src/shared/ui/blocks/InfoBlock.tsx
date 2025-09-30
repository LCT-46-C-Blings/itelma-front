import Flex from "./Flex"

const InfoBlock: React.FC<{
    value: string
    label: string
    className?: string
}> = ({ value, label, ...props }) => {
    return (
        <Flex className={"flex-col gap-8px p-24px bg-white rounded-10px " + props.className}>
            <p className="p-0 m-0 font-size-16px text-gray-500 fw-400">{label}</p>
            <p className="p-0 m-0 font-size-24px fw-400">{value}</p>
        </Flex>
    )
}

export default InfoBlock;