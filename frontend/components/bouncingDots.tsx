import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, ViewProps } from 'react-native';

// 1. On définit l'interface pour les propriétés
interface AnimatedDotProps {
    delay: number;
    color?: string; // Optionnel : pour pouvoir changer la couleur si besoin
}

const AnimatedDot = ({ delay, color = '#007AFF' }: AnimatedDotProps) => {
    const opacity = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 600,
                    delay: delay,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.4,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [delay, opacity]);

    return (
        <Animated.View style={[styles.dot, { opacity: opacity, backgroundColor: color }]} />
    );
};

// Le composant principal que tu exportes
export const LoadingDots = () => {
    return (
        <Animated.View style={styles.dotsContainer}>
            <AnimatedDot delay={0} />
            <AnimatedDot delay={200} />
            <AnimatedDot delay={400} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    dotsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});

export default LoadingDots;
