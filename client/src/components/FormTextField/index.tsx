import { FormControl, FormLabel, Input } from "@mui/joy";

interface FormTextFieldProps {
    data: object | any;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormTextField: React.FC<FormTextFieldProps> = ({ onChange, value, data }) => {

    return (
        <>
            <FormControl required={data.required}>
                <FormLabel>{data.label}</FormLabel>
                <Input type={data.type}
                    name={data.name}
                    value={value}
                    onChange={onChange}
                />
            </FormControl>
        </>
    );

}

export default FormTextField;