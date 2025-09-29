
const Grid8x4: React.FC<{
    children?: React.ReactNode
}> = ({children}) => {
    return (
        <div className="
            grid 
            grid-cols-8 
            grid-rows-4
            gap-x-32px
            gap-y-32px
            px-64px
            py-64px
            w-full
            h-100vh
            box-border"
        >
            {children}
        </div>
    )
}

export default Grid8x4;