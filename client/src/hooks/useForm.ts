import { useState } from 'react';

export const useForm = <T>(initialValues: T) => {
    const [formValues, setFormValues] = useState<T>(initialValues);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [event.target.name]: event.target.value,
        });
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [event.target.name]: event.target.checked,
        });
    };

    return {
        formValues,
        handleChange,
        handleCheckboxChange,
        errorMessage,
        setErrorMessage,
    };
};
