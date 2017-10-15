import React from 'react';
import {
   Text,
   View,
   FlatList,
} from 'react-native';
import PropTypes from 'prop-types';


class Swiper extends React.Component {



   render() {
      return (
         <FlatList data={this.props.data}
                   renderItem={this.props.renderItem}
                   horizontal={true}
                   pagingEnabled={true}
                   centerContent={true}
                   directionalLockEnabled={true}
                   showsHorizontalScrollIndicator={false}
         />

      );
   }
}

export default Swiper

