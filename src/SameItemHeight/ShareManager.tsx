import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import Share from './Share';
import { RenderForItem } from '../type';

interface Props {
    shareGroup: number[][];
    inputs: number[][];
    outputs: number[][];
    renderForItem: RenderForItem;
    offset: Animated.Value;
    horizontal?: boolean | null;
    containerSize: { height: number; width: number };
    containerSizeMain: number;
    heightForItem: number;
    preOffset: number;
}

export default class ShareManager extends React.PureComponent<Props> {
    shareRefs: React.RefObject<Share>[] = [];

    constructor(props: Props) {
        super(props);
        const { shareGroup } = this.props;
        this.shareRefs = shareGroup.map(() => React.createRef<Share>());
    }

    UNSAFE_componentWillReceiveProps(next: Props) {
        if (next.shareGroup.length !== this.props.shareGroup.length) {
            this.shareRefs = next.shareGroup.map(() => React.createRef<Share>());
        }
    }

    update = (contentOffset: number, isForward?: boolean) => {
        this.shareRefs.forEach((v) => v.current?.update(contentOffset, isForward));
    };

    render() {
        const {
            shareGroup,
            inputs,
            outputs,
            renderForItem,
            offset,
            horizontal,
            containerSize,
            containerSizeMain,
            heightForItem,
            preOffset,
        } = this.props;
        return shareGroup.map((indexes, index) => {
            let transform: any;
            if (inputs[index].length > 1) {
                transform = [
                    {
                        [horizontal ? 'translateX' : 'translateY']: offset.interpolate({
                            inputRange: inputs[index],
                            outputRange: outputs[index],
                        }),
                    },
                ];
            }
            return (
                <Animated.View key={index} style={[{ transform }, horizontal ? styles.horizontalAbs : styles.abs]}>
                    <Share
                        indexes={indexes}
                        renderForItem={renderForItem}
                        ref={this.shareRefs[index]}
                        horizontal={horizontal}
                        containerSize={containerSize}
                        containerSizeMain={containerSizeMain}
                        heightForItem={heightForItem}
                        preOffset={preOffset}
                        input={inputs[index]}
                        output={outputs[index]}
                    />
                </Animated.View>
            );
        });
    }
}

const styles = StyleSheet.create({
    abs: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
    },
    horizontalAbs: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
    },
});
