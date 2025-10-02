import { formatDiagnosis, type FhrSegment, type UterusSegment } from "ctg-live-detector-ts";
import { useDetectorStore } from "../../../entities/detector/stores/useDetectorStore";
import ContentBlock from "../../../shared/ui/blocks/ContentBlock"
import Flex from "../../../shared/ui/blocks/Flex";
import Button from "../../../shared/ui/button/Button";
import { useChartsStore } from "../../Charts/stores/useChartsStore";
import Title from "../../../shared/ui/Typography/Title";
import Divider from "../../../shared/ui/Divider/Divider";

/**
 * Component for displaying a list of abnormal segments of a patient's CTG data.
 *
 * @param {string} [className] Optional CSS class name for the component.
 *
 * @returns {React.ReactElement} A React element representing the component.
 */
const AbnormalSegments: React.FC<{
    className?: string
}> = (props) => {

    const abnormalSegments = useDetectorStore(state => state.allSegments);
    const getSegmentChartType = useDetectorStore(state => state.getSegmentChartType);
    const setZoomValues = useChartsStore(state => state.setZoomValues);

    return (
        <ContentBlock className={"flex flex-col overflow-y-scroll overflow-x-hidden pt-20px! pb-20px! px-20px! gap-10px! " + props.className}>
            <Title order={2} className="ml-10px mt-10px">Подозрения</Title>
            <Divider />
            {abnormalSegments.map((segment: FhrSegment | UterusSegment, i) => {
                return (
                    <Button className="w-full p-0!" onClick={() => {  setZoomValues(getSegmentChartType(segment), { start: 0, end: 0, startValue: Math.max(segment.startTime - 20, 0), endValue: segment.endTime + 20 })}}>
                        <Flex className="flex-row rounded-10px items-center p-20px justify-between h-64px w-full" key={i}>
                            <Flex className="flex-row gap-5px items-center">
                                <p className="p-0 m-0 color-#00000080 font-size-12px lh-16px">{i + 1}</p>
                                <p className="p-0 m-0 color-#00A7B5 font-size-16px lh-16px">{formatDiagnosis(segment)}</p>
                            </Flex>
                            <Flex className="flex-col gap-5px opacity-50 items-end">
                                <p className="p-0 m-0 font-size-12px lh-12px">с {segment.startTime} сек.</p>
                                <p className="p-0 m-0 font-size-12px lh-12px">по {segment.endTime} сек.</p>
                            </Flex>
                        </Flex>
                    </Button>

                )
            })}
        </ContentBlock>
    )
}

export default AbnormalSegments