import Flex from "./Flex";

export type ContentBlockProps = {
    className?: string,
    children?: React.ReactNode
}

/**
 * A component that renders a content block with a white background and rounded corners.
 *
 * It also applies padding and margin to the content block.
 *
 * The component accepts a className prop which is used to add additional CSS classes to the component.
 *
 * The component renders its children inside a Flex component with a column direction.
 *
 * The component is a wrapper around the Flex component and provides default CSS styles for the content block.
 *
 * @param {ContentBlockProps} props - The props object with a className prop.
 * @returns {JSX.Element} - The rendered component.
 */
const ContentBlock: React.FC<ContentBlockProps> = (props) => {
    // // console.log(props.className)
    return (
        <Flex className={`
            bg-#F5F5F5
            rounded-10px
            px-43px
            pt-45px
            pb-40px
            w-full
            h-full
            gap-20px
            flex-col
        ` + props.className}>
            {props.children}
        </Flex>
    )
}

export default ContentBlock;