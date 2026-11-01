package com.salfamontajes.flow

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.webkit.JavascriptInterface
import android.widget.Toast

/**
 * SalfaWebAppInterface - Puente de comunicación bidireccional entre JavaScript y Android Nativo
 * Ecosistema: Portales Salfa Pilotos · Salfa Montajes
 */
class SalfaWebAppInterface(private val activity: MainActivity) {

    /**
     * Respuesta háptica para confirmación táctil al marcar tareas o pulsar el FAB
     */
    @JavascriptInterface
    fun vibrate(durationMs: Long) {
        try {
            val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = activity.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vibratorManager?.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                activity.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            }

            vibrator?.let {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    it.vibrate(VibrationEffect.createOneShot(durationMs.coerceIn(5, 500), VibrationEffect.DEFAULT_AMPLITUDE))
                } else {
                    @Suppress("DEPRECATION")
                    it.vibrate(durationMs.coerceIn(5, 500))
                }
            }
        } catch (_: Exception) {}
    }

    /**
     * Notificación nativa tipo Toast en Android
     */
    @JavascriptInterface
    fun showToast(message: String) {
        activity.runOnUiThread {
            Toast.makeText(activity, message, Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * Identificador para que la web sepa que se ejecuta dentro del contenedor nativo
     */
    @JavascriptInterface
    fun isAndroidApp(): Boolean = true

    /**
     * Versión de la aplicación móvil Salfa
     */
    @JavascriptInterface
    fun getAppVersion(): String = "1.0.0-salfa"

    /**
     * Dispara la captura fotográfica de terreno en la cámara nativa
     */
    @JavascriptInterface
    fun triggerCameraCapture() {
        activity.runOnUiThread {
            activity.launchCameraCapture()
        }
    }
}
