package pl.edu.agh.toik.infun.services;

public class RandomColorFactory {
    public static IRandomColor getRandomColor() {
        return new RandomColor();
    }
}
