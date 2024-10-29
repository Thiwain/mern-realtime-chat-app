import bcrypt from 'bcrypt';

export const HashPassword = async (password: string): Promise<string> => {
    try {
        if (!password) throw new Error('password required');
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    } catch (error: any) {
        throw new Error(error.message)
    }
};

export const MatchPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
};
