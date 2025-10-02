
/**
 * A component that renders a grid layout with 8 columns and 4 rows.
 * The component applies gap-x and gap-y CSS properties to the grid to create a 32px gap between each cell.
 * The component also applies px and py CSS properties to the grid to create a 64px padding on the x and y axes.
 * The component renders its children inside the grid.
 * The component is a wrapper around the grid component and provides default CSS styles for the grid.
 * @param {React.ReactNode} children - The children of the component.
 */
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