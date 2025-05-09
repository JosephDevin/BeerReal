package fr.epita.beerreal.ui.home;

import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.camera.core.ImageCapture;
import androidx.camera.core.ImageCaptureException;
import androidx.fragment.app.Fragment;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.content.ContextCompat;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;

import com.google.android.material.floatingactionbutton.FloatingActionButton;

import fr.epita.beerreal.R;
import fr.epita.beerreal.databinding.FragmentHomeBinding;

import java.io.File;
import java.util.concurrent.ExecutionException;

public class HomeFragment extends Fragment {

    private PreviewView previewView;
    private ProcessCameraProvider cameraProvider;
    private ImageCapture imageCapture;

    public static boolean cameraActive = false;

    private FragmentHomeBinding binding;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentHomeBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        previewView = binding.previewView;

        Button captureButton = binding.captureButton;
        captureButton.setVisibility(View.GONE);

        FloatingActionButton exitButton = binding.exitButton;
        exitButton.setVisibility(View.GONE);

        FloatingActionButton addButton = binding.addButton;

        addButton.setOnClickListener(v -> {
            if (!cameraActive) {
                StartCamera();

                captureButton.setVisibility(View.VISIBLE);
                exitButton.setVisibility(View.VISIBLE);
                addButton.setVisibility(View.GONE);

                cameraActive = true;
            }
        });

        captureButton.setOnClickListener(v -> CapturePhoto());

        exitButton.setOnClickListener(v -> DestroyCamera());

        return root;
    }

    private void StartCamera() {
        if (ContextCompat.checkSelfPermission(
                requireContext(), android.Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(requireContext(), "Camera permission not granted", Toast.LENGTH_SHORT).show();
            return;
        }

        ProcessCameraProvider.getInstance(requireContext()).addListener(() -> {
            try {
                cameraProvider = ProcessCameraProvider.getInstance(requireContext()).get();

                Preview preview = new Preview.Builder().build();
                imageCapture = new ImageCapture.Builder().build(); // NEW LINE: create capture use case

                CameraSelector cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA;

                preview.setSurfaceProvider(previewView.getSurfaceProvider());
                cameraProvider.unbindAll();
                cameraProvider.bindToLifecycle(
                        getViewLifecycleOwner(),
                        cameraSelector,
                        preview,
                        imageCapture // NEW: also bind imageCapture
                );

            } catch (ExecutionException | InterruptedException e) {
                e.printStackTrace();
            }
        }, ContextCompat.getMainExecutor(requireContext()));
    }


    private void DestroyCamera() {
        if (cameraProvider != null) {
            cameraProvider.unbindAll();
            NavController navController = Navigation.findNavController(requireActivity(), R.id.nav_host_fragment_activity_main);
            navController.navigate(R.id.navigation_home);

            cameraActive = false;
        }
    }

    private void CapturePhoto() {
        if (imageCapture == null) {
            Toast.makeText(getContext(), "ImageCapture not ready", Toast.LENGTH_SHORT).show();
            return;
        }

        File photoFile = new File(requireContext().getExternalFilesDir(null), "photo_" + System.currentTimeMillis() + ".jpg");

        ImageCapture.OutputFileOptions outputOptions = new ImageCapture.OutputFileOptions.Builder(photoFile).build();

        imageCapture.takePicture(
                outputOptions,
                ContextCompat.getMainExecutor(requireContext()),
                new ImageCapture.OnImageSavedCallback() {
                    @Override
                    public void onImageSaved(@NonNull ImageCapture.OutputFileResults outputFileResults) {

                        OpenBeerMenu(photoFile.getAbsolutePath());

                    }

                    @Override
                    public void onError(@NonNull ImageCaptureException exception) {
                        exception.printStackTrace();
                        Toast.makeText(getContext(), "Photo capture failed: " + exception.getMessage(), Toast.LENGTH_SHORT).show();
                    }

                }
        );
    }

    private void OpenBeerMenu(String path) {
        DestroyCamera();

        //TODO
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null; // Avoid memory leaks
    }
}
