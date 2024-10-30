import { Button } from "@mui/joy";

interface FormBtnProps {
    title: string;
}

const FormBtn = (props: FormBtnProps) => {
    return (
        <>
            <Button type="submit" fullWidth>
                {props.title}
            </Button>
        </>
    );
};
export default FormBtn;