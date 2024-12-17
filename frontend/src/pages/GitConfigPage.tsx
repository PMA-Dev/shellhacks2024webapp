import { useForm } from 'react-hook-form';
export const GitConfigPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data: unknown) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p>{errors.name.message as string}</p>}
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email format',
                        },
                    })}
                />
                {errors.email && <p>{errors.email.message as string}</p>}
            </div>

            <button type="submit">Submit</button>
        </form>
    );
};
