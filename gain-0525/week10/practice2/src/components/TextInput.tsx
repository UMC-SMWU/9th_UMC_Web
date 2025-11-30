import { type ReactElement } from "react";

interface ITextInput {
    onChange: (text: string) => void;
}

const TextInput = ({ onChange } : ITextInput) : ReactElement => {
    console.log('TextInput rendered');
    return(
        <input
            type='text'
            className="border p-4 rounded-lg"
            onChange={(e) : void => onChange(e.target.value)}
        />
    )
};
export default (TextInput);
// 동작을 하는 척 한다