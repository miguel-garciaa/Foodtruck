package expo.modules.foodtrucksgoogle

import android.content.MutableContextWrapper
import androidx.credentials.CredentialManager
import androidx.credentials.ClearCredentialStateRequest
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.functions.Coroutine
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class FoodtrucksGoogleModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("FoodtrucksGoogle")

    AsyncFunction("signIn") Coroutine { clientId: String, nonce: String ->
      if (!clientId.endsWith(".apps.googleusercontent.com") || nonce.length != 64) {
        throw CodedException("Configuración de Google no disponible.")
      }
      val activity = appContext.currentActivity ?: throw CodedException("Abre la aplicación para iniciar sesión.")
      withContext(Dispatchers.Main) {
        val option = GetSignInWithGoogleOption.Builder(clientId).setNonce(nonce).build()
        val request = GetCredentialRequest.Builder().addCredentialOption(option).build()
        val credential = CredentialManager.create(activity)
          .getCredential(MutableContextWrapper(activity), request).credential
        if (credential !is CustomCredential || credential.type != GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
          throw CodedException("Google no ha devuelto una identificación válida.")
        }
        GoogleIdTokenCredential.createFrom(credential.data).idToken
      }
    }

    AsyncFunction("signOut") Coroutine { ->
      val context = appContext.reactContext ?: throw CodedException("La aplicación no está disponible.")
      CredentialManager.create(context).clearCredentialState(ClearCredentialStateRequest())
      Unit
    }
  }
}
