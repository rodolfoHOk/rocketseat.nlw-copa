import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useTheme } from 'native-base';
import { Platform } from 'react-native';
import { NewPoll } from '../screens/NewPoll';
import { Polls } from '../screens/Polls';
import { FindPoll } from '../screens/FindPoll';
import { PollDetails } from '../screens/PollDetails';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const { colors, sizes } = useTheme();
  const size = sizes[6];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: colors.yellow[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle: {
          position: 'absolute',
          height: sizes[22],
          borderTopWidth: 0,
          backgroundColor: colors.gray[800],
        },
        tabBarItemStyle: {
          position: 'relative',
          top: Platform.OS === 'android' ? -10 : 0,
        },
      }}
    >
      <Screen
        name="new"
        component={NewPoll}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="pluscircleo" size={size} color={color} />
          ),
          tabBarLabel: 'Novo bolão',
        }}
      />

      <Screen
        name="polls"
        component={Polls}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="soccer-ball-o" size={size} color={color} />
          ),
          tabBarLabel: 'Meus bolões',
        }}
      />

      <Screen
        name="find"
        component={FindPoll}
        options={{
          tabBarButton: () => null,
        }}
      />

      <Screen
        name="details"
        component={PollDetails}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Navigator>
  );
}
