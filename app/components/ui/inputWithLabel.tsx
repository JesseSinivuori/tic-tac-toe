import { Input, InputProps } from "./input";
import { Label, LabelProps } from "./label";

type InputWithLabelProps = {
  inputProps: InputProps;
  labelProps: LabelProps;
} & React.ComponentProps<"div">;

export const InputWithLabel = ({
  className,
  inputProps,
  labelProps,
  ...props
}: InputWithLabelProps) => {
  return (
    <div className={`${className || ""} relative flex`} {...props}>
      <Input
        {...inputProps}
        className={`${
          inputProps.className || ""
        } peer !placeholder-transparent`}
      />
      <Label
        {...labelProps}
        className={`${
          labelProps.className || ""
        } absolute -top-7 left-0 cursor-text text-sm transition-all duration-300 peer-placeholder-shown:left-4 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus-visible:-top-7 peer-focus-visible:left-0 peer-focus-visible:text-sm`}
      >
        {labelProps.children}
      </Label>
    </div>
  );
};
