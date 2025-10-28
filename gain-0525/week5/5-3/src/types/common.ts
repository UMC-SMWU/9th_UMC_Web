export type CommonRespone <T>= {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
}