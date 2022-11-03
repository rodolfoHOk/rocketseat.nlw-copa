import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
  icon: React.ReactNode;
}

export function ButtonIcon({ icon: Icon, ...rest }: Props) {
  return <TouchableOpacity {...rest}>{Icon}</TouchableOpacity>;
}
