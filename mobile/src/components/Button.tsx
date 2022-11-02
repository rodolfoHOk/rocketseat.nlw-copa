import { Button as ButtonNativeBase, Text, IButtonProps } from 'native-base';

interface ButtonPros extends IButtonProps {
  title: string;
  type?: 'PRIMARY' | 'SECONDARY';
}

export function Button({ title, type = 'PRIMARY', ...rest }: ButtonPros) {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      rounded="sm"
      fontSize="md"
      bgColor={type === 'SECONDARY' ? 'red.500' : 'yellow.500'}
      _pressed={{ bgColor: type === 'SECONDARY' ? 'red.400' : 'yellow.600' }}
      _loading={{ _spinner: { color: 'black' } }}
      {...rest}
    >
      <Text
        fontSize="sm"
        fontFamily="heading"
        color={type === 'SECONDARY' ? 'white' : 'black'}
        textTransform={'uppercase'}
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
