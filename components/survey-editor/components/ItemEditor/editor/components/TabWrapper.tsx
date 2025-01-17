export const TabWrapper = (props: { children: React.ReactNode }) => {
    return (
        <div className='p-4 ps-6 space-y-4 overflow-y-auto'>
            {props.children}
        </div>
    )
}
