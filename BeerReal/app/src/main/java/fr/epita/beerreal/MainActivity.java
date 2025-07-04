package fr.epita.beerreal;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.Toast;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import fr.epita.beerreal.ui.stats.alcodex.AlcodexStorage;
import fr.epita.beerreal.csv.CsvHelper;
import fr.epita.beerreal.ui.map.LocationStorage;
import fr.epita.beerreal.databinding.ActivityMainBinding;
import fr.epita.beerreal.ui.home.HomeFragment;
import fr.epita.beerreal.ui.stats.achievements.JSONHelper;


public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    public static String CsvPath = "";

    public static AlcodexStorage alcodex;
    public static JSONHelper achievements;

    private final String[] requiredPermissions = new String[]{
            Manifest.permission.CAMERA,
            Manifest.permission.ACCESS_FINE_LOCATION
    };

    private final ActivityResultLauncher<String> requestPermissionLauncher =
            registerForActivityResult(new ActivityResultContracts.RequestPermission(), isGranted -> {
                if (allPermissionsGranted()) {
                    StartAppLogic();
                } else {
                    Toast.makeText(this, "Permissions are required to use the app.", Toast.LENGTH_LONG).show();
                    finish(); // Exit app if user declines
                }
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.black));
        getSupportActionBar().hide();

        // Check and request permissions before launching app logic
        if (allPermissionsGranted()) {
            StartAppLogic();
        } else {
            requestNextMissingPermission();
        }
    }

    private boolean allPermissionsGranted() {
        for (String permission : requiredPermissions) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        return true;
    }

    private void requestNextMissingPermission() {
        for (String permission : requiredPermissions) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                requestPermissionLauncher.launch(permission);
                return;
            }
        }
    }

    private void StartAppLogic() {
        // LOCATION
        LocationStorage.RecalculatePosition(this, (latitude, longitude) -> {
        });

        // CSV
        CsvPath = CsvHelper.InitialiseCSV(this);
        CsvHelper.CreateImageDir(this);


        // ALCODEX
        alcodex = new AlcodexStorage(this);

        // ACHIEVEMENTS
        achievements = new JSONHelper(this);

        // NAVIGATION
        BottomNavigationView navView = findViewById(R.id.nav_view);
        AppBarConfiguration appBarConfiguration = new AppBarConfiguration.Builder(
                R.id.navigation_home, R.id.navigation_map, R.id.navigation_stats)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_activity_main);
        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
        NavigationUI.setupWithNavController(binding.navView, navController);

        navController.addOnDestinationChangedListener((controller, destination, arguments) -> {
            HomeFragment.cameraActive = false;
        });
    }

    /*
    j'ai envie de mourir:
    - alcodex qui sont lourds comme des lourdingues
       */
}
