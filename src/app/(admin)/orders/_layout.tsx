import { Stack } from "expo-router"


const OrderLayout = () => {

  return (
    <Stack >
        <Stack.Screen name='list' options={{headerShown:  false}}/>
      </Stack>
  )
}

export default OrderLayout;