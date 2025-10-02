import Flex from "../blocks/Flex"

const Button: React.FC<{
    className?: string
    onClick?: () => void
    children?: React.ReactNode
}> = (props) => {
    return (<>
        <button onClick={props.onClick} className={`
        outline-none 
        border-none 
        h-fit 
        bg-transparent 
        cursor-pointer
        p-24px 
        bg-white 
        rounded-10px
        hover:bg-#FFFFFF80
        ` + props.className}>
            {props.children}
        </button>

    </>)
}

export default Button