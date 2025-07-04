package fr.epita.beerreal.ui.stats.achievements;

public class Achievement {

    public String Name;
    public String Description;
    public boolean Unlocked;
    public String Id;

    public Achievement(String id, String name, String description, boolean unlocked) {
        Id = id;
        Name = name;
        Description = description;
        Unlocked = unlocked;
    }

}
