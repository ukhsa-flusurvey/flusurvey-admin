import { BsCaretDownFill, BsCaretRightFill } from "react-icons/bs";

const SlotLabel = (props: { label: string, required?: boolean, isHidden?: boolean, toggleHide?: () => void }) => {
    return <p className='text-[12px] font-semibold mb-1 text-slate-600 flex items-center cursor-pointer group'
        onClick={() => {
            if (props.toggleHide !== undefined) {
                props.toggleHide()
            }
        }}
    >
        {props.toggleHide !== undefined && <button
            className='me-1'
            type='button'
            onClick={(event) => {
                event.stopPropagation();
                if (props.toggleHide !== undefined) {
                    props.toggleHide()
                }
            }}
        >
            {!props.isHidden ? <BsCaretDownFill /> : <BsCaretRightFill />}
        </button>}
        <span className=''>{props.label}</span>
        {props.required && <span className='text-red-500 ms-1'>*</span>}

    </p>
}

export default SlotLabel;
