import { useState } from "react"

const TextInput: React.FC<{
    className?: string
    value?: string
    onChange?: (v: string) => void
    placeholder?: string
    disabled?: boolean
}> = (props) => {
    
    const [value, setValue] = useState(props.value)

    return (<>
        <input onChange={(e) => setValue(e.target.value)} disabled={props.disabled} onBlur={(e) => props.onChange && props.onChange(e.target.value)} value={value} placeholder={props.placeholder} className={`
        outline-none 
        border-none 
        h-fit 
        bg-transparent 
        cursor-pointer
        bg-white 
        rounded-10px
        hover:bg-#FFFFFF80
        ` + props.className}/>
    </>)
}

export default TextInput