import React from 'react';
import {
   StyleSheet,
   Text,
   View,
   Dimensions,
   Animated,
   PanResponder,
} from 'react-native';
import Swiper from './src/Swiper'
import Carousel from 'react-native-snap-carousel'

const screenwidth = Dimensions.get('window').width
const screenheight= Dimensions.get('window').height

const bgA1 = 'rgba(0,167,255, 0.4)'
const bgA2 = 'rgba(100,167,0, 0.3)'

const bgB1 = 'rgba(240,20,123, 0.6)'
const bgB2 = 'rgba(200,0,123, 0.7)'

export default class App extends React.Component {


   constructor(props){
      super(props)
      this._entries = [
         {title:'1'},
         {title:'2'},
         {title:'3'},
         {title:'4'},
         {title:'5'},
         {title:'6'},
         {title:'7'},
         {title:'8'},
      ]
      this.state = {
         selectedIndexA:0,
         selectedIndexB:0,
         showDetails: false
      }
      this._openValue = new Animated.Value(0)
   }



   componentWillMount(){
      this._panValue = new Animated.Value(0)
      this._panResponder = PanResponder.create({
         onMoveShouldSetPanResponder: (e, gestureState) => {
            return Math.abs(gestureState.dy) > 10
         },
         //onMoveShouldSetPanResponderCapture: (e, gestureState) => false,
         onPanResponderGrant: (e, gestureState) => {

            const inter = !this.state.showDetails
               ? {
                  inputRange: [0, 150, 300],
                  outputRange: [0, 0.5, 1],
               }
               : {
                  inputRange: [-200, -100, 0],
                  outputRange: [1, 0.9, 0],
               }


            Animated.spring(this._openValue, {
               toValue: this._panValue.interpolate(inter),

            }).start();

         },
         onPanResponderMove: Animated.event(
            [null, {dy: this._panValue}]
         ),
         onPanResponderRelease: (e, gestureState) => {

            const {showDetails} = this.props

            if(!showDetails){
               if (gestureState.dy > 100) {
                  //this.props.onOpen(gestureState.vy)
                  Animated.timing(this._openValue, {
                     toValue: 1,
                     duration:400,
                  }).start()
               }else{
                  //this.props.onClose(gestureState.vy)
                  Animated.timing(this._openValue, {
                     toValue: 0,
                     duration:400,
                  }).start()
               }
            }else{
               if (gestureState.dy < -60) {
                  //this.props.onClose(gestureState.vy)
                  Animated.timing(this._openValue, {
                     toValue: 1,
                     duration:400,
                  }).start()
               }else{
                  //this.props.onOpen(gestureState.vy)
                  Animated.timing(this._openValue, {
                     toValue: 0,
                     duration:400,
                  }).start()

               }
            }


         },
      })
   }



   _renderItemA ({item, index}) {
      const color = index === this.state.selectedIndexA ? bgA1 : bgA2
      const itemStyle = itemInterpolatedStyle(this._openValue)
      return (
         <Animated.View key={index} style={[{height:200, width:220, backgroundColor:color}, itemStyle]}>
            <Text>{ item.title }</Text>
         </Animated.View>
      );
   }

   _renderItemB ({item, index}) {
      const color = index === this.state.selectedIndexB ? bgB1 : bgB2
      const itemStyle = itemInterpolatedStyle(this._openValue)
      return (
      <View style={{padding:10}} key={index}>
         <Animated.View style={[{height:200, width:220, backgroundColor:color}, itemStyle]}>
            <Text>{ item.title }</Text>
         </Animated.View>
      </View>
      );
   }

   _onSnapToItemHandlerA(index){
      this.setState({
         selectedIndexA:index
      })
   }

   _onSnapToItemHandlerB(index){
      this.setState({
         selectedIndexB:index
      })
   }

   render() {
      return (
         <View style={{flex:1,paddingTop:30}} {...this._panResponder.panHandlers}>
            <View style={st.a}>

               <Carousel
                  ref={(c) => { this._carousel = c; }}
                  data={this._entries}
                  renderItem={(...args)=>this._renderItemA(...args)}
                  sliderWidth={screenwidth}
                  itemWidth={220}
                  enableMomentum="false"
                  decelerationRate="fast"
                  onSnapToItem={(index) => this._onSnapToItemHandlerA(index)}
               />

            </View>


            <View style={st.b}>

               <Swiper data={this._entries}
                       renderItem={(...args)=>this._renderItemB(...args)}
                       onSnapToItem={(index) => this._onSnapToItemHandlerB(index)}
               />

            </View>


            <Animated.View style={littleHelperStyle(this._openValue)} />
         </View>
      );
   }
}

const st = StyleSheet.create({
   a:{
      backgroundColor:'rgba(0,255,255,0.1)'
   },
   b:{
      backgroundColor:'rgba(200,255,0,0.1)', flex:1
   }
})


function littleHelperStyle(openValue){
   return {
      position:'absolute', right:0, top:0, height:20, width:20, backgroundColor:'rgba(240,34,0, 0.8)',
      transform:[{translateY:openValue.interpolate({
         inputRange:[0, 1],
         outputRange:[0, screenheight-20],
         extrapolate:'clamp'
      })}]
   }
}

function itemInterpolatedStyle(openValue){
   return {
      borderRadius:openValue.interpolate({
         inputRange:[0, 1],
         outputRange:[0, 60],
         extrapolate:'clamp'
      })
   }
}