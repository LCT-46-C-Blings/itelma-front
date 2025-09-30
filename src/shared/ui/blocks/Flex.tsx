
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