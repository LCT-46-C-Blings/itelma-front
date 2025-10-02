
/**
 * A Title component.
 * @param {number} [order] - The order of the title element, defaults to 1.
 * @param {React.ReactNode} [children] - The content of the title element.
 * @returns {React.ReactElement} - The rendered title element.
 */
const Title: React.FC<{
    order?: 1 | 2 | 3 | 4 | 5 | 6
    children?: React.ReactNode
}> = (props) => {

    return (<>
        {
            props.order === 1 ?
                <h1 className={`m-0 font-size-36px fw-700 `}
                >
                    {props.children}
                </h1> :
                props.order === 2 ?
                    <h2 className="m-0 font-size-24px fw-200">
                        {props.children}
                    </h2> :
                    props.order === 3 ?
                        <h3>
                            {props.children}
                        </h3> :
                        props.order === 4 ?
                            <h4>
                                {props.children}
                            </h4> :
                            props.order === 5 ?
                                <h5>
                                    {props.children}
                                </h5> :
                                props.order === 6 ?
                                    <h6>
                                        {props.children}
                                    </h6> :
                                    <h1>{props.children}</h1>
        }
    </>)
}

export default Title