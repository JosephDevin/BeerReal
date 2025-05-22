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

    import fr.epita.beerreal.alcodex.AlcodexStorage;
    import fr.epita.beerreal.csv.CsvHelper;
    import fr.epita.beerreal.ui.map.LocationStorage;
    import fr.epita.beerreal.databinding.ActivityMainBinding;
    import fr.epita.beerreal.ui.home.HomeFragment;
    import fr.epita.beerreal.ui.stats.achievements.Achievement;
    import fr.epita.beerreal.ui.stats.achievements.JSONHelper;

    public class MainActivity extends AppCompatActivity {

        private ActivityMainBinding binding;
        public static String CsvPath = "";

        public static AlcodexStorage alcodex;

        public static JSONHelper achievements;

        private final ActivityResultLauncher<String> requestPermissionLauncher =
                registerForActivityResult(new ActivityResultContracts.RequestPermission(), isGranted -> {
                    if (isGranted) {
                        Toast.makeText(this, "Permission granted", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(this, "Permission denied", Toast.LENGTH_SHORT).show();
                    }
                });

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);

            // PERMISSIONS
            CheckCameraPermission();

            CheckLocationPermission();


            // LOCATION RELATED ACTIONS
            LocationStorage.RecalculatePosition(this, (latitude, longitude) -> {
            });

            // ARCHITECTURE RELATED ACTIONS
            CsvPath = CsvHelper.InitialiseCSV(this);
            CsvHelper.CreateImageDir(this);

            // ALCODEX RELATED ACTIONS
            alcodex = new AlcodexStorage(this);
            achievements = new JSONHelper(this, "achievements.json");

            achievements.SetUnlocked("Marathon runner", true);

            for (Achievement a : achievements.GetAllUnlocked()) {
                System.out.println(a.Name);
            }

            System.out.println("LOCKED");

            for (Achievement a : achievements.GetAllLocked()) {
                System.out.println(a.Name);
            }

            // ACTIVITY RELATED ACTIONS
            binding = ActivityMainBinding.inflate(getLayoutInflater());
            setContentView(binding.getRoot());

            getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.black));
            getSupportActionBar().hide();

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





        // PERMISSIONS CHECK
        private void CheckCameraPermission() {
            if (ContextCompat.checkSelfPermission(
                    this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            } else {
                requestPermissionLauncher.launch(Manifest.permission.CAMERA);
            }
        }

        private void CheckLocationPermission() {
            if (ContextCompat.checkSelfPermission(
                    this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            } else {
                requestPermissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION);
            }
        }
    }

