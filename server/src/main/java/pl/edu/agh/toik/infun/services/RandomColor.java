package pl.edu.agh.toik.infun.services;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class RandomColor implements IRandomColor {
    // from https://stackoverflow.com/a/4382138
    private static List<String> colors = Arrays.asList(
            "#FFB300", // Vivid Yellow
            "#803E75", // Strong Purple
            "#FF6800", // Vivid Orange
            "#A6BDD7", // Very Light Blue
            "#C10020", // Vivid Red
            "#CEA262", // Grayish Yellow
            "#817066", // Medium Gray

            // The following don't work well for people with defective color vision
            "#007D34", // Vivid Green
            "#F6768E", // Strong Purplish Pink
            "#00538A", // Strong Blue
            "#FF7A5C", // Strong Yellowish Pink
            "#53377A", // Strong Violet
            "#FF8E00", // Vivid Orange Yellow
            "#B32851", // Strong Purplish Red
            "#F4C800", // Vivid Greenish Yellow
            "#7F180D", // Strong Reddish Brown
            "#93AA00", // Vivid Yellowish Green
            "#593315", // Deep Yellowish Brown
            "#F13A13", // Vivid Reddish Orange
            "#232C16" // Dark Olive Green
    );

    private final Set<String> usedColors = ConcurrentHashMap.newKeySet();

    public String getColor(final int num) {
        final String color = nextColor(num);
        usedColors.add(color);
        return color;
    }

    private String nextColor(final int num) {
        if (num < colors.size()) {
            return colors.get(num);
        }
        final int colorIndex = num % colors.size();
        final int indexDiff = num / colors.size();
        final String color1 = colors.get(colorIndex);
        final String color2 = colors.get((colorIndex + indexDiff) % colors.size());
        return combineColors(color1, color2);
    }

    private String combineColors(final String color1, final String color2) {
        final int num1 = Integer.parseInt(color1.substring(1), 16);
        final int num2 = Integer.parseInt(color2.substring(1), 16);
        return "#" + Integer.toHexString(num1 ^ num2);
    }

    public void returnColor(final String color) {
        this.usedColors.remove(color);
    }
}
