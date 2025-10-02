/**
 * Button component.
 * @param {string} [className] - Additional CSS classes.
 * @param {() => void} [onClick] - Click handler.
 * @param {React.ReactNode} [children] - Button content.
 * @returns {React.ReactElement} - Button element.
 */
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