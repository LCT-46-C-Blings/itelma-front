import React, { Fragment } from "react"
import Divider from "../Divider/Divider"
import Flex from "./Flex"

/**
 * A component that renders a scrollable box with a white background and rounded corners.
 * It applies padding and margin to the box.
 * The component renders its children inside a Flex component with a column direction.
 * The component is a wrapper around the Flex component and provides default CSS styles for the box.
 * @param {string} className - The class name to be applied to the component.
 * @param {React.ReactNode} children - The children of the component.
 */
const ScrollBox: React.FC<{
    className?: string,
    children?: React.ReactNode,
}> = ({ className, children }) => {
    return (
        <Flex className={`flex flex-col p-24px overflow-y-scroll overflow-x-hidden gap-8px bg-white rounded-10px ${className}`}>
            {React.Children.map(children, (child, index) => {
                return (
                    <Fragment>
                        {index !== 0 ? <Divider /> : null}
                        {child}
                    </Fragment>
                )
            })}
        </Flex>
    )
}

export default ScrollBox