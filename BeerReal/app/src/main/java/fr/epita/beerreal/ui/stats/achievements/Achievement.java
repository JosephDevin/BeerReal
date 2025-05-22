package fr.epita.beerreal.ui.stats.achievements;

public class Achievement {

    public String Name;
    public String Description;
    public boolean Unlocked;

    public Achievement(String name, String description, boolean unlocked) {
        Name = name;
        Description = description;
        Unlocked = unlocked;
    }

}
